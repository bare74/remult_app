import { remult } from "remult";
import { Task } from "../../shared/Task";
import api from "./[...remult]";

export default api.handle(async (req, res) => {
  const taskRepo = remult.repo(Task);
  res.json({
    total: await taskRepo.count(),
    completed: await taskRepo.count({ completed: true }),
  });
});
