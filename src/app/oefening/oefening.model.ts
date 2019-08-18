export class Oefening {
    private _oefeningId: number;

    private _sessieId: number;
    private _naam: string;
    private _dateAdded: Date = new Date();
    private _beschrijving: string;
    private _file: File;
    private _fileName: string;
    private _fileMimetype: string;
    private _fileOriginalName: string;
    private _fileSize: number;
    private _groepen: string;
    private _url: string;

    constructor(naam: string, beschrijving: string, sessieId: number) {
      this._naam = naam;
      this._beschrijving = beschrijving;
      this._sessieId = sessieId;
    }

    /**
     * Geeft het id van een oefening terug
     */
    get id(): number {
      return this._oefeningId;
    }

    /**
     * Geeft de naam van een oefening terug
     */
    get naam(): string {
      return this._naam;
    }

    /**
     * Geeft het sessieId van een oefening terug
     */
    get sessieId(): number {
      return this._sessieId;
    }

    /**
     * Geeft de beschrijving van een oefening terug
     */
    get beschrijving(): string {
      return this._beschrijving;
    }

    get datumGemaakt(): Date {
      return this._dateAdded;
    }

    get file(): File {
      return this._file;
    }

    get fileName(): string {
      return this._fileName;
    }

    get fileSize(): number {
      return this._fileSize;
    }

    get fileOriginalName(): string {
      return this._fileOriginalName;
    }

    get fileMimetype(): string {
      return this._fileMimetype;
    }

    get groepen(): string {
      return this._groepen;
    }

    get url(): string {
      return this._url;
    }

    /**
     * Verandert de naam van de oefening
     * @param naam: Dit is de nieuwe naam van de oefening
     */
    set naam(naam: string) {
      this._naam = naam;
    }

    /**
     * Verandert de beschrijving van de oefening
     * @param beschrijving: Dit is de nieuwe beschrijving van de oefening
     */
    set beschrijving(beschrijving: string) {
      this._beschrijving = beschrijving;
    }

    set fileName(name: string) {
      this._fileName = name;
    }

    set fileSize(size: number) {
      this._fileSize = size;
    }

    set fileOriginalName(originalName: string) {
      this._fileOriginalName = originalName;
    }

    set fileMimetype(mimetype: string) {
      this._fileMimetype = mimetype;
    }

    set file(file: File) {
      this._file = file;
    }

    set groepen(groepen: string) {
      this._groepen = groepen;
    }

    set url(url: string){
      this._url = url;
    }

    /**
     * Verandert het sessieid van de oefening
     * @param id: Dit is de nieuwe sessieId van de oefening
     */
    set sessieId(id: number) {
      this._sessieId = id;
    }


    /** **/
    static fromJSON(json: any): Oefening {
      const oefening = new Oefening(
        json.naam, json.beschrijving, json.sessieId
      );
      return oefening;
    }

    toJSON() {
      return {
        oefeningId: this.id,
        naam: this._naam,
        beschrijving: this._beschrijving,
        sessieId: this._sessieId,
        fileMimetype: this._fileMimetype,
        fileName: this._fileName,
        fileOriginalName: this._fileOriginalName,
        fileSize: this._fileSize,
        groepen: this._groepen,
        url: this._url
      };
    }
  }
