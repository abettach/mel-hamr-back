import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { chatRoomDto } from "src/dto-classes/chatRoom.dto";
import { chatRoom } from "src/entities/chatRoom.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { UserService } from "src/user/user.service";
@Injectable()
export class chatRoomService
{
	constructor(private userServ : UserService,
		@InjectRepository(chatRoom) private RoomRepository: Repository<chatRoom>,
		@InjectRepository(User) private usersRepository: Repository<User>,
		private readonly jwtService: JwtService
	){}

	async createRoom(owner : string , data : any)
	{
		console.log("data=",data);
		let userName = owner
		let user = await this.usersRepository.findOneBy({userName : userName})
		let room : chatRoom = await this.RoomRepository.create({ RoomOwner : userName })
		room.members = [user]
		room.RoomOwner = owner
		console.log(data.name)
		room.name = data.name
		room.type = data.type
		room.protected = data.protected
		if(room.protected == true)
		room.password = data.password
		if(data.users !== undefined)
		{
			for(let us of data.users)
			{
				let userInfo : User = await this.usersRepository.findOneBy({userName : us.userName})
				room.members = [...room.members , userInfo]
			}
		}
		return await this.RoomRepository.save(room)
	}

	async getRoomById(roomId : number )
	{
		let room = await this.RoomRepository
		.createQueryBuilder("chat")
		.leftJoinAndSelect("chat.members", "Users").where('chat.id = :id', { id: roomId })
		.getOne();

		return room

	}

	async addUsersToChannel(roomId : number ,  users: any)
	{
		let room : chatRoom = await this.getRoomById(roomId)
		console.log(room)
		if(users.length !== 0)
		{
				users.map(async (e:any) => {
					
					let userInfo : User = await this.usersRepository.findOneBy({userName : e.userName})
					room.members = [...room.members , userInfo]
				})
		
	
		}
		await room.save()
	}
	async getPublicRooms()
	{
		return await this.RoomRepository.findBy({type : "public"})
	}


	async getAllRooms()
	{
		let PbRoom = await this.RoomRepository.findBy({type : "public"})
		let PrRoom = await this.RoomRepository.findBy({type : "private"})


		return { public : PbRoom , private : PrRoom};
	}
	async changeOwner(roomId : number , newOwner : any)
	{
		let room : chatRoom = await this.getRoomById(roomId)
		room.RoomOwner = newOwner 
		console.log(room);
		await room.save()
	}

	async deleteUser(roomId : number, userToDelete : string)
	{
		let room : any = this.getRoomById(roomId)
		let i : number = 0
		let index : number = -1
		if(room)
		{
			room.members?.map(async (e:any) => {
				if(e.userName === userToDelete)
				{
					console.log("im hrere")
					index = i
				}
				i++
			})
			console.log("here is index " , index)
		}
	}
}
