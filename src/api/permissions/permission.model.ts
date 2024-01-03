import mongoose, { Schema } from 'mongoose';

interface IPageAreasPermissions {
  pageAccessId: string;
  isRead: boolean;
  isWrite: boolean;
}

interface IBrandsPermissions {
  brandId: string;
  isRead: boolean;
  isWrite: boolean;
}

export interface IPermission extends mongoose.Document {
  pageAreasPermissions: IPageAreasPermissions[];
  brandsPermissions: IBrandsPermissions[];
}

const permissionSchema = new mongoose.Schema<IPermission>(
  {
    pageAreasPermissions: [
      {
        pageAccessId: { type: Schema.Types.ObjectId, ref: 'pageAreas' },
        isRead: Boolean,
        isWrite: Boolean,
      },
    ],
    brandsPermissions: [
      {
        brandId: { type: Schema.Types.ObjectId, ref: 'brands' },
        isRead: Boolean,
        isWrite: Boolean,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('permissions', permissionSchema);
