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
      if (work.title.length < 3) throw "Too Short";
    },
    allowApiUpdate: "admin",
  })
  title = "";

  @Fields.string()
  workplace = "";

  @Fields.string()
  text = "";

  @Fields.date()
  fromdate?: Date;

  @Fields.date()
  todate?: Date;
}
