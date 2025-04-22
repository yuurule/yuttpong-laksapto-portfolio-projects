import { PrismaClient, Prisma, CampaignHistoryAction } from '@prisma/client';
import * as exception from '../libs/errorException';
import { 
  createCampaignDto, 
  updateCampaignDto, 
  createCampaignHistoryDto, 
  activateCampaignDto, 
  addRemoveProductCampaignDto 
} from '../types';

const prisma = new PrismaClient();

export class CampaignService {

  async findAll(
    page: number, 
    pageSize: number,
    pagination: boolean = false,
    orderBy: string = 'createdAt', //createdAt, name, discount
    orderDir: string = 'desc',
    search: string,
  ) {
    try {
      let where: Prisma.CampaignWhereInput = {};
      if(search) {
        where.name = {
          contains: search
        }
      }

      const totalCampaigns = await prisma.campaign.findMany({ where });
      const totalPages = Math.ceil(totalCampaigns.length / pageSize);
      const campaigns = await prisma.campaign.findMany({
        where,
        include: {
          campaignProducts: {
            include: {
              product: true
            }
          },
          campaignHistories: true,
          orderItems: true,
        },
        orderBy: {
          [orderBy]: orderDir
        },
        skip: pagination ? (page - 1) * pageSize : undefined,
        take: pagination ? pageSize : undefined,
      });
      
      return {
        data: campaigns,
        meta: {
          totalItems: totalCampaigns.length,
          totalPages: totalPages,
          currentPage: page,
          pageSize
        }
      };
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find all campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const findCampaign = await prisma.campaign.findUnique({ 
        where: { id: id },
        include: {
          campaignProducts: {
            include: {
              product: true
            }
          },
          campaignHistories: true,
          orderItems: true,
        } 
      });
      if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${id}`);
      return findCampaign;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error find one campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async create(dto: createCampaignDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      const newCampaign = await prisma.campaign.create({
        data: {
          name: dto.name,
          description: dto.description,
          discount: dto.discount,
          createdBy: { connect: { id: dto.userId } },
          updatedBy: { connect: { id: dto.userId } }
        }
      });

      return newCampaign;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async update(id: number, dto: updateCampaignDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      // ตรวจสอบ campaign มีอยู่จริง
      const findCampaign = await prisma.campaign.findUnique({ where: { id: id } });
      if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${id}`);

      const updateData : any = {};
      if(dto.name !== undefined) updateData.name = dto.name;
      if(dto.description !== undefined) updateData.description = dto.description;
      if(dto.discount !== undefined) updateData.discount = dto.discount;
      updateData.updatedBy = { connect: { id: dto.userId } };

      const updateCampaign = await prisma.campaign.update({
        where: { id: id },
        data: updateData
      });

      return updateCampaign;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async activate(dto: activateCampaignDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      // ตรวจสอบ campaign มีอยู่จริง
      const findCampaign = await prisma.campaign.findUnique({ where: { id: dto.campaignId } });
      if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${dto.campaignId}`);

      const activateData = {
        isActive: dto.isActive,
        startAt: dto.isActive ? dto.startAt : null,
        endAt: dto.isActive ? dto.endAt : null,
        updatedBy: { connect: { id: dto.userId } }
      }

      const activateCampaign = await prisma.campaign.update({
        where: { id: dto.campaignId },
        data: activateData
      });

      return activateCampaign;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error Activate/Deactivate campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Soft delete
  async moveToTrash(id: number[], userId: number) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${userId}`);

      // ตรวจสอบ campaign มีอยู่จริง
      const existingCampaigns = await prisma.campaign.findMany({
        where: { 
          id: { in: id },
          deletedAt: null // ตรวจสอบว่ายังไม่ถูกลบไปแล้ว
        },
        select: { id: true }
      });

      if (existingCampaigns.length !== id.length) {
        throw new exception.NotFoundException("Some campaign not found or already deleted");
      }

      const transaction = await prisma.$transaction(async (tx) => {
        const softDeleteCampaigns = [];

        for(const thisId of id) {
          const action = await tx.campaign.update({
            where: { id: thisId },
            data: {
              deletedAt: new Date(),
              deletedBy: {
                connect: { id: userId }
              },
              updatedBy: {
                connect: { id: userId }
              }
            },
            select: {
              id: true,
              name: true,
              deletedAt: true,
            }
          });

          softDeleteCampaigns.push(action);
        }

        return softDeleteCampaigns;
      });

      return transaction;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error move campaigns to trash due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Campaign history
  async createHistory(dto: createCampaignHistoryDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      // ตรวจสอบ campaign มีอยู่จริง
      const findCampaign = await prisma.campaign.findUnique({ where: { id: dto.campaignId } });
      if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${dto.campaignId}`);

      const newHistory = await prisma.campaignHistory.create({
        data: {
          campaign: { connect: { id: dto.campaignId } },
          action: dto.action as CampaignHistoryAction,
          note: dto.note ?? "",
          createdBy: { connect: { id: dto.userId } }
        }
      });

      return newHistory;
    }
    catch(error: any) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error creating campaign history due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  // Campaign product item
  async addProductCampaign(dto: addRemoveProductCampaignDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      // ตรวจสอบ campaign มีอยู่จริง
      const findCampaign = await prisma.campaign.findUnique({ where: { id: dto.campaignId } });
      if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${dto.campaignId}`);

      // ตรวจสอบ product ทุกตัวมีอยู่จริง
      const findProducts = await prisma.product.findMany({ where: { id: { in: dto.productsId } } });
      if(!findProducts) throw new exception.NotFoundException(`Some product not found`);

      const addProductsInCampaign = await prisma.campaignProduct.createMany({
        data: dto.productsId.map(id => (
          {
            campaignId: dto.campaignId,
            productId: id,
            assignedById: dto.userId
          }
        ))
      });

      return addProductsInCampaign;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }

  async removeProductCampaign(dto: addRemoveProductCampaignDto) {
    try {
      // ตรวจสอบ user มีอยู่จริง
      // const findUser = await prisma.user.findUnique({ where: { id: dto.userId } });
      // if(!findUser) throw new exception.NotFoundException(`Not found user with id ${dto.userId}`);

      // ตรวจสอบ campaign มีอยู่จริง
      const findCampaign = await prisma.campaign.findUnique({ where: { id: dto.campaignId } });
      if(!findCampaign) throw new exception.NotFoundException(`Not found campaign with id ${dto.campaignId}`);

      const removeProductsInCampaign = await prisma.campaignProduct.deleteMany({
        where: {
          campaignId: dto.campaignId,
          productId: { in: dto.productsId }
        }
      });

      return removeProductsInCampaign;
    }
    catch(error: any) {
      if(error instanceof exception.NotFoundException) throw error;
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new exception.DatabaseException(`Error update one campaign due to: ${error.message}`);
      }
      throw new exception.InternalServerException(`Something went wrong due to: ${error.message}`);
    }
  }
}