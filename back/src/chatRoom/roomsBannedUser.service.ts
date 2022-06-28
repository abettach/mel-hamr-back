import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { roomMessage } from "src/entities/roomMessage.entity";
import { roomBannedUser } from "src/entities/roomsBannedUser.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()

export class roomBannedUserService
{
    constructor(
        @InjectRepository(roomBannedUser) private banRoomRepository: Repository<roomBannedUser>,
		@InjectRepository(User) private usersRepository: Repository<User>,
		private readonly jwtService: JwtService
        ){}
        
        
    async muteUser(userName : string , roomId : number , periode : number , periodeType : string)
    {
        let muteUser : roomBannedUser = await this.banRoomRepository.create()
        
        muteUser.bannedUserName = userName
        muteUser.roomId = roomId
        muteUser.banType =  "mute"
        var time : Date = new Date()
        if(periodeType === "hour")
            muteUser.unBanTime = new Date(time.getTime() + (periode * 60 * 60000))
        else if(periodeType === "min")
           muteUser.unBanTime = new Date(time.getTime() + (periode  * 60000))
        
        await muteUser.save()
    }

    async getBannedUserByRoomId(roomId : number)
    {
        await this.banRoomRepository.findBy({roomId : roomId})
    }
}