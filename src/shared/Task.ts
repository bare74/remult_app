import { Allow, Entity, Fields } from "remult";

@Entity<Task>("tasks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin",
})
export class Task {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: (task) => {
      if (task.title.length < 3) throw "Too Short";
    },
    allowApiUpdate: "admin",
  })
  title = "";

  @Fields.boolean()
  completed = false;
}
