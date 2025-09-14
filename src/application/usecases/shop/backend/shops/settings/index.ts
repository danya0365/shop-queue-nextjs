import { CreateShopSettingsUseCase } from "./CreateShopSettingsUseCase";
import { DeleteShopSettingsUseCase } from "./DeleteShopSettingsUseCase";
import { ExportShopSettingsUseCase } from "./ExportShopSettingsUseCase";
import { GetShopSettingsByIdUseCase } from "./GetShopSettingsByIdUseCase";
import { GetShopSettingsStatsUseCase } from "./GetShopSettingsStatsUseCase";
import { GetShopSettingsUseCase } from "./GetShopSettingsUseCase";
import { ImportShopSettingsUseCase } from "./ImportShopSettingsUseCase";
import { ResetShopSettingsUseCase } from "./ResetShopSettingsUseCase";
import { UpdateShopSettingsUseCase } from "./UpdateShopSettingsUseCase";
import { ValidateShopSettingsUseCase } from "./ValidateShopSettingsUseCase";

// Shop Settings Use Cases
export * from "./CreateShopSettingsUseCase";
export * from "./DeleteShopSettingsUseCase";
export * from "./ExportShopSettingsUseCase";
export * from "./GetShopSettingsByIdUseCase";
export * from "./GetShopSettingsStatsUseCase";
export * from "./GetShopSettingsUseCase";
export * from "./ImportShopSettingsUseCase";
export * from "./ResetShopSettingsUseCase";
export * from "./UpdateShopSettingsUseCase";
export * from "./ValidateShopSettingsUseCase";

// Convenience exports for common use case patterns
export {
  CreateShopSettingsUseCase,
  DeleteShopSettingsUseCase,
  ExportShopSettingsUseCase,
  GetShopSettingsByIdUseCase,
  GetShopSettingsStatsUseCase,
  GetShopSettingsUseCase,
  ImportShopSettingsUseCase,
  ResetShopSettingsUseCase,
  UpdateShopSettingsUseCase,
  ValidateShopSettingsUseCase,
};

// Type exports for better TypeScript support
export type {
  CreateShopSettingsUseCase as ICreateShopSettingsUseCase,
  DeleteShopSettingsUseCase as IDeleteShopSettingsUseCase,
  ExportShopSettingsUseCase as IExportShopSettingsUseCase,
  GetShopSettingsByIdUseCase as IGetShopSettingsByIdUseCase,
  GetShopSettingsStatsUseCase as IGetShopSettingsStatsUseCase,
  GetShopSettingsUseCase as IGetShopSettingsUseCase,
  ImportShopSettingsUseCase as IImportShopSettingsUseCase,
  ResetShopSettingsUseCase as IResetShopSettingsUseCase,
  UpdateShopSettingsUseCase as IUpdateShopSettingsUseCase,
  ValidateShopSettingsUseCase as IValidateShopSettingsUseCase,
};
