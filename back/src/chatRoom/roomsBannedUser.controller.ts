import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/guards/jwt-auth.gguard";
import { roomBannedUserService } from "./roomsBannedUser.service";


@Controller('roomBannedUsers')
export class roomBannedUsersController {
	constructor(
		private readonly roomBannedUserServ: roomBannedUserService ,
		// @InjectRepository(roomMessage) private roomMessageRep: Repository<roomMessage>,
		// @InjectRepository(User) private usersRepository: Repository<User>,
		private readonly jwtService: JwtService
	) {}

    @Post("muteUser")
	@UseGuards(JwtAuthGuard)
    async muteUser(@Body() data : any)
    {
        await this.roomBannedUserServ.muteUser(data.userName, data.roomId, data.periode , data.periodeType)
    }

    @Post("getBannedUserByRoomId")
	@UseGuards(JwtAuthGuard)
    async getBannedUserByRoomId(@Body() data : any)
    {
        await this.roomBannedUserServ.getBannedUserByRoomId(data.roomId)
    }
}
