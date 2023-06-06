import  { WebPartContext } from "@microsoft/sp-webpart-base";
import Service from "./service/Service";
import BaseService from "./service/Service";

/**
 * Retrieve the service based on EnvironmentType, Mock or Tenant. Only Tenant since local workbench is obsolete.
 */
export default class DataService {

   public static getService(context: WebPartContext): BaseService {
     return new Service();
  }
}
