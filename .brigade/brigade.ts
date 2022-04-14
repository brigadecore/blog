import { events } from "@brigadecore/brigadier"
import axios from "axios"

events.on("brigade.sh/cron", "daily-redeploy", async event => {
	await axios.post(event.project.secrets.deployHookURL)
})

events.process()
