import { remult } from "remult";
import { School } from "../../shared/School";
import api from "./[...remult]";

export default api.handle(async (req, res) => {
  const schoolRepo = remult.repo(School);
  res.json({
    total: await schoolRepo.count(),
  });
});
