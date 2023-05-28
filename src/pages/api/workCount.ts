import { remult } from "remult";
import { Work } from "../../shared/Work";
import api from "./[...remult]";

export default api.handle(async (req, res) => {
  const workRepo = remult.repo(Work);
  res.json({
    total: await workRepo.count(),
  });
});
