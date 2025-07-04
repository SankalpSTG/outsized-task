import {Request, Response} from "express"
import { Responses } from "../../misc/responses"
import { ResourceService } from "./resource.service"

const getAdminResource = async (req: Request, res: Response) => {
    const response = await ResourceService.getAdminResource()
    res.status(200).json(Responses.successResponse(response))
}

const getGuestResource = async (req: Request, res: Response) => {
    const response = await ResourceService.getGuestResource()
    res.status(200).json(Responses.successResponse(response))
}

const getUserResource = async (req: Request, res: Response) => {
    const response = await ResourceService.getUserResource()
    res.status(200).json(Responses.successResponse(response))
}

export const ResourceController = {
    getAdminResource,
    getGuestResource,
    getUserResource
}