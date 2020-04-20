import { Injectable } from '@angular/core';
import villagers from '../data/villagers.json';
import { Villager } from './villager.dto';
import { ComboboxValue } from './combo-value.dto';

@Injectable({
  providedIn: 'root'
})
export class VillagerService {

  constructor() { }

  /**
   * Permet de récupérer la liste complète des villageois ACNH
   */
  public findAll(): Villager[] {
    return villagers;
  }

  /**
   * Permet de récupérer un villageois qui match l'id s'il existe
   * @param id l'id d'un objet villageois
   */
  public findById(id: string): Villager {
    return villagers.find(elem => {
      return elem.id === id;
    });
  }

  /**
   * Permet de construire et récupérer la liste des genres possibles triée
   */
  public getAllGenders(): ComboboxValue[] {
    const listGender: ComboboxValue[] = [];
    villagers.forEach((villager: Villager) => {
      // On évite les doublons
      const f = listGender.find((gender: ComboboxValue) => {
        return gender.value === villager.gender;
      });
      if (f === undefined) {
        listGender.push({ value: villager.gender, name: villager.gender});
      }
    });

    listGender.sort((a: ComboboxValue, b: ComboboxValue) => {
      return a.value.localeCompare(b.value);
    });
    return listGender;
  }

  /**
   * Permet de construire et récupérer la liste des espèces possibles triée
   */
  public getAllSpecies(): ComboboxValue[] {
    const listSpecies: ComboboxValue[] = [];
    villagers.forEach((villager: Villager) => {
      // On évite les doublons
      const f = listSpecies.find((species: ComboboxValue) => {
        return species.value === villager.species;
      });
      if (f === undefined) {
        listSpecies.push({ value: villager.species, name: villager.species});
      }
    });

    listSpecies.sort((a: ComboboxValue, b: ComboboxValue) => {
      return a.value.localeCompare(b.value);
    });
    return listSpecies;
  }
}
