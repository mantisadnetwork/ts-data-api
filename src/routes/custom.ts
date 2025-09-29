import * as h3 from "h3";

import update_properties_batch from "../handlers/custom/update_properties_batch";
import update_zones_batch from "../handlers/custom/update_zones_batch";
import update_zones from "../handlers/custom/update_zones";

export const router = h3.createRouter()
    .add(...update_properties_batch)
    .add(...update_zones_batch)
    .add(...update_zones);
