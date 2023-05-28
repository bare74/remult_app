import { Allow, Entity, Fields } from "remult";

@Entity("works", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin",
})
export class Work {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: (work) => {
      if (work.name.length < 3) throw "Too Short";
    },
    allowApiUpdate: "admin",
  })
  name = "";

  @Fields.string()
  text = "";

  @Fields.date()
  fromDate?: Date;

  @Fields.date()
  toDate?: Date;
}
