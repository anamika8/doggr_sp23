import { Collection, Entity, EntitySchema, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class User extends BaseEntity {	
	@Property()
	email!: string;

}

