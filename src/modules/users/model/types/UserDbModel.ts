import { UserDataModel } from './UserDataModel'
import { ConfirmationInfoModel } from '../../../auth'

export type UserDbModel = {
  userData: UserDataModel
  confirmationData: ConfirmationInfoModel
}
