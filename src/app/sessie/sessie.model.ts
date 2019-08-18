import { Oefening } from '../oefening/oefening.model';

export class Sessie {
  private _naam: string;
  private _dateAdded: Date = new Date();
  private _beschrijving: string;
  private _oefeningen = new Array<Oefening>();
  private _id: number;
  private _sessieCode: string;

  constructor(naam: string, beschrijving: string) {
    this._naam = naam;
    this._beschrijving = beschrijving;
  }

  /**
   * Geeft de naam van de sessie terug
   */
  get naam(): string {
    return this._naam;
  }

  /**
   * Geeft de beschrijving van de sessie terug
   */
  get beschrijving(): string {
    return this._beschrijving;
  }

  /**
   * Geeft het sessieId van de sessie terug
   */
  get id(): number {
    return this._id;
  }

    /**
   * Geeft de toegangscode van de sessie terug
   */
  get sessieCode(): string {
    return this._sessieCode;
  }

  /**
   * wijzigt de naam van de sessie
   * @param naam: dit is de nieuwe naam van de sessie
   */
  set naam(naam: string) {
    this._naam = naam;
  }

  /**
   * wijzigt het id van de sessie
   * @param id: dit is het nieuwe sessieID
   */
  set id(id: number) {
    this._id = id;
  }

  /**
   * wijzigt de beschrijving van de sessie
   * @param beschrijving: dit is de nieuwe beschrijving van de sessie
   */
  set beschrijving(beschrijving: string) {
    this._beschrijving = beschrijving;
  }

   /**
   * wijzigt de toegangscode van de sessie
   * @param beschrijving: dit is de nieuwe beschrijving van de sessie
   */
  set sessieCode(sessieCode: string) {
    this._sessieCode = sessieCode;
  }

  /**
   * voegt een oefening toe aan deze sessie
   * @param oefening Dit is een oefening die wordt toegevoegd aan de sessie
   */
  addOefening(oefening: Oefening) {
    this._oefeningen.push(oefening);
  }

  /**
   * Geeft de lijst van oefeningen van deze sessie terug
   */
  get oefeningen() {
    return this._oefeningen;
  }

  /**
   * Wijzigt de oefeningen van een sessie
   * @param oef: Dit is de nieuwe lijst van oefeningen van een sessie
   */
  set oefeningen(oef: Array<Oefening>) {
    this._oefeningen = oef;
  }
}
