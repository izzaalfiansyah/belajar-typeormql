import { User } from "../entity/user";
import { DB } from "../utils/db";

export const userSchema = `
    type User {
        id: ID
        name: String
        email: String
        isVerified: Boolean
        posts: [Post]
    }
`;

export const userQuery = `
    user(id: ID!): User
    users(isVerified: Boolean): [User]
`;

export const userMutation = `
    createUser(name: String!, email: String!): Boolean
    updateUser(id: ID!, name: String!, email: String!): Boolean
    deleteUser(id: ID!): Boolean
    verifyUser(id: ID!): Boolean
`;

export const userRepo = DB.getRepository(User);

export const userServices = {
  async users(props: { isVerified?: boolean }) {
    let where: any = {};

    if (props.isVerified != null) {
      where.isVerified = props.isVerified;
    }

    const users = await userRepo.find({
      where,
      relations: ["posts"],
    });

    return users;
  },
  async user(props: { id: number }) {
    const user = await userRepo.findOne({
      where: { id: props.id },
      relations: ["posts"],
    });

    return user;
  },
  async createUser(props: User) {
    const user = await userRepo.save({
      name: props.name,
      email: props.email,
    });

    return !!user;
  },
  async updateUser(props: User) {
    const user = await userRepo.findOneBy({ id: props.id });

    if (!user) {
      return false;
    }

    user.name = props.name;
    user.email = props.email;

    await userRepo.save(user);

    return true;
  },
  async deleteUser(props: { id: number }) {
    const res = await userRepo.delete({ id: props.id });

    return !!res.affected;
  },
  async verifyUser(props: { id: number }) {
    const user = await userRepo.findOneBy({ id: props.id });

    if (!user) {
      return false;
    }

    user.isVerified = true;
    await userRepo.save(user);

    return true;
  },
};
