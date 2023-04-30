
import { Entity, Property, Unique, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import type {Rel} from "@mikro-orm/core";


@Entity()
export class Match {

	// The person who performed the match/swiped right
	//one owner could have many matches, many ties to the class and to ties to the field
	@ManyToOne({primary: true})
	owner!: Rel<User>;

	// The account whose profile was swiped-right-on
	//one user account to be able to matched by lots of other people
	@ManyToOne({primary: true})
	matchee!: Rel<User>;

	@Property()
	created_at = new Date();

}
