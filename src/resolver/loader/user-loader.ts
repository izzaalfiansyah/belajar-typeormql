import DataLoader from "dataloader";
import { User } from "../../entity/user";

export const userLoader = new DataLoader(async (ids: readonly number[]) => {
  const users = await User.createQueryBuilder("user")
    .where("user.id IN (:...ids)", {
      ids,
    })
    .getMany();

  return ids.map((id) => users.find((user) => user.id == id));
});
