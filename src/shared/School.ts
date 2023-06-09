import { Allow, Entity, Fields } from "remult";

@Entity("schools", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin",
})
export class School {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: (school) => {
      if (school.name.length < 3) throw "Too Short";
    },
    allowApiUpdate: "admin",
  })
  name = "";

  @Fields.string()
  occupation = "";

  @Fields.date()
  fromdate?: Date;

  @Fields.date()
  todate?: Date;
}
