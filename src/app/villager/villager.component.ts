import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Villager } from './villager.dto';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { VillagerService } from './villager.service';
import { ComboboxValue } from './combo-value.dto';
import { DEFAULT_COMBO_VALUE, URL_VILLAGERS_WL, AC_MAX_VILLAGERS } from '../app.const';
import { VillagerLight } from './villager-light.dto';
import { ParamService } from './param.service';

@Component({
  selector: 'app-villager',
  templateUrl: './villager.component.html',
  styleUrls: ['./villager.component.scss']
})
export class VillagerComponent implements OnInit {

  public villagersWL: Villager[];
  public url: string;
  public villagers: Villager[];
  public showCriteria = false;
  public speciesCriteria: string;
  public genderCriteria: string;
  public model: string;
  public search: (text: Observable<string>) => Observable<readonly Villager[]>;
  public formatter: (item: Villager) => string;
  public genders: ComboboxValue[];
  public species: ComboboxValue[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private villagerService: VillagerService,
    private paramService: ParamService
    ) {
      this.villagers = villagerService.findAll();
    }

  /**
   * Initialisation du controlleur
   */
  ngOnInit(): void {
    this.buildGendersCombobox();
    this.buildSpeciesCombobox();
    this.villagersWL = [];
    this.activatedRoute.paramMap.subscribe(params => {
      const paramB: string = params.get('b');
      // Pour chacun des id villageois de l'url
      this.paramService.paramToVillagersLight(paramB).forEach((val: VillagerLight) => {
        // On recherche l'objet villageois correspondant
        const objUrl: Villager = this.villagerService.findById(val.i);
        // S'il existe, on remet la valeur de la possession qui est propre à la WL et pas au référentiel, et on ajoute l'objet à la WL
        if (objUrl) {
          objUrl.owned = val.o;
          this.villagersWL.push(objUrl);
        }
      });

      if (this.villagersWL.length === 0) {
        this.showCriteria = true;
      }

      this.generateUrl();
    });

    this.search = (text$: Observable<string>) =>
        text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(term => term.length < 2 ? [] // a besoin d'être normaliser pour la recherche contenent des accents
            : this.villagers.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        );

    this.formatter = (x: Villager) => x.name;
  }

  /**
   * Permet d'ajouter l'élément selectionné dans l'autocomplétion dans la WL
   * @param e evenement de selection
   */
  public onSelect(e: NgbTypeaheadSelectItemEvent): void{
    e.preventDefault();
    this.add(e.item);

    this.model = '';
  }

  /**
   * Permet de générer/mettre à jour l'URL de la WL
   */
  public generateUrl(): void {
    const villagersLight: VillagerLight[] = [];
    // On construit l'objet light
    this.villagersWL.forEach(val => {
      villagersLight.push({ i: val.id, o: val.owned });
    });
    const param = this.paramService.villagersLightToParam(villagersLight);
    // On met à jour l'url à copier/coller
    this.url = environment.frontUrl + URL_VILLAGERS_WL + param;
    // On force la mise à jour de l'URL du navigateur (TODO : Voir s'il existe pas une meilleure façon de faire)
    this.location.go(URL_VILLAGERS_WL + param);
  }

  /**
   * Permet de forcer la copie de l'input dans le presse-papier de l'utilisateur
   * @param inputElement Input contenant la valeur à copier
   */
  public copyText(inputElement: HTMLInputElement): void {
    // TODO : Ajouter une notification pour indiquer la réussite
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  /**
   * Permet d'ajouter un villageois à la WL en respectant un maximum de 10 et en bloquant les doublons (limite du jeu)
   * @param villager Villageois à ajouter
   */
  public add(villager: Villager): void {
    if (this.villagersWL.indexOf(villager) === -1 && this.villagersWL.length < AC_MAX_VILLAGERS) {
      this.villagersWL.push(villager);
      this.generateUrl();
    }
  }

  /**
   * Permet de supprimer un villageois de la WL
   * @param villager Villageois à supprimer
   */
  public delete(villager: Villager): void {
    // On cherche l'index de l'objet dans la liste
    const index = this.villagersWL.findIndex(elem => {
      return elem.id === villager.id;
    });
    // S'il existe on le supprime
    if (index !== -1) {
      this.villagersWL.splice(index, 1);
    }
    this.generateUrl();
  }

  /**
   * Permet d'afficher ou de masquer la liste de recherche par critères
   */
  public showHideCriteria(): void {
    this.showCriteria = !this.showCriteria;
  }

  private buildGendersCombobox(): void {
    const listGender = this.villagerService.getAllGenders();
    listGender.unshift(ComboboxValue.default());

    this.genderCriteria = DEFAULT_COMBO_VALUE;
    this.genders = listGender;
  }

  private buildSpeciesCombobox(): void {
    const listSpecies = this.villagerService.getAllSpecies();
    listSpecies.unshift(ComboboxValue.default());

    this.speciesCriteria = DEFAULT_COMBO_VALUE;
    this.species = listSpecies;
  }

}
