import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from 'src/auth/models/user.interface';
import { Repository, UpdateResult } from 'typeorm';
import { FeedPostEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepository: Repository<FeedPostEntity>
    ){}

    createPost(user: User, feedPost: FeedPost): Observable<FeedPost>{
        feedPost.author = user;
        return from(this.feedPostRepository.save(feedPost));
    }

    getAllPost(): Observable<FeedPost[]>{
        return from(this.feedPostRepository.find());
    }

    getPosts(max: number = 10, offset: number = 0, orderBy?: any): Observable<FeedPost[]>{
        return from(this.feedPostRepository.findAndCount({take: max,skip: offset, order: {id: orderBy}}).then(([posts]) => {
            return <FeedPost[]>posts
        }))
    }

    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>{
        return from(this.feedPostRepository.update(id,feedPost));
    }
}
