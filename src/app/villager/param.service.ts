import { Injectable } from '@angular/core';
import { VillagerLight } from './villager-light.dto';

@Injectable({
  providedIn: 'root'
})
export class ParamService {

  constructor() { }

  /**
   * Permet de convertir le paramètre en objet compatible avec l'application
   * @param param le paramètre contenant les villageois light en base 64
   */
  public paramToVillagersLight(param: string): VillagerLight[] {
    let arr: VillagerLight[] = [];
    try {
      arr = JSON.parse(atob(decodeURIComponent(param)));
    } catch (e) {
      console.error(e);
    }
    return arr;
  }

  /**
   * Permet de convertir l'objet de l'application en paramètre pour que l'utilisateur puisse sauvegarder ou partager sa liste
   * @param villagersLight l'objet de l'application en paramètre pour que l'utilisateur puisse sauvegarder ou partager sa liste
   */
  public villagersLightToParam(villagersLight: VillagerLight[]): string {
    return encodeURIComponent(btoa(JSON.stringify(villagersLight)));
  }
}
