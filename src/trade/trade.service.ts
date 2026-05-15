import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradePost, TradeStatus } from './trade-post.entity';
import { TradeImage } from './trade-image.entity';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TradeListQueryDto } from './dto/trade-list-query.dto';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradePost)
    private readonly tradePostRepository: Repository<TradePost>,
    @InjectRepository(TradeImage)
    private readonly tradeImageRepository: Repository<TradeImage>,
  ) {}

  async findAll(query: TradeListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.tradePostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.images', 'images')
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('images.order', 'ASC');

    if (query.category) {
      qb.andWhere('post.category = :category', { category: query.category });
    }
    if (query.status) {
      qb.andWhere('post.status = :status', { status: query.status });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.tradePostRepository.findOne({
      where: { id },
      relations: ['images', 'user'],
      order: { images: { order: 'ASC' } },
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    if (post.user) {
      return {
        ...post,
        user: {
          id: post.user.id,
          email: post.user.email,
          nickname: post.user.nickname,
          tag: post.user.tag,
          createdAt: post.user.createdAt,
        },
      };
    }
    return post;
  }

  async create(userId: string, dto: CreateTradeDto) {
    const post = this.tradePostRepository.create({
      userId,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      status: TradeStatus.ON_SALE,
    });
    const saved = await this.tradePostRepository.save(post);

    if (dto.images?.length) {
      const images = dto.images.map((img) =>
        this.tradeImageRepository.create({
          postId: saved.id,
          imageUrl: img.imageUrl,
          order: img.order,
        }),
      );
      await this.tradeImageRepository.save(images);
    }

    return this.findOne(saved.id);
  }

  async update(id: string, userId: string, dto: UpdateTradeDto) {
    const post = await this.findOwnedPost(id, userId);
    Object.assign(post, dto);
    await this.tradePostRepository.save(post);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const post = await this.findOwnedPost(id, userId);
    await this.tradePostRepository.remove(post);
    return { deleted: true };
  }

  async updateStatus(id: string, userId: string, dto: UpdateStatusDto) {
    const post = await this.findOwnedPost(id, userId);
    post.status = dto.status;
    await this.tradePostRepository.save(post);
    return this.findOne(id);
  }

  private async findOwnedPost(id: string, userId: string) {
    const post = await this.tradePostRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('본인의 게시글만 수정할 수 있습니다.');
    }
    return post;
  }
}
