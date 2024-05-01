type ConfigGolfDataOnce = {
  Index: number,
  Editable: boolean,
  Color: string
  TextColor: string
  Name: string;
  HDC: string;
  VGA: string;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  TotalRound: number
  Total: number
};

type GolfDataPlayer = {
  Scores: number[]
  Bag: string
  Caddie: string
  CarNo: string
  Color: string
  TextColor: string
  HDC: number
  VGA: number
  NamePlayer: string
  TeeBox: string
}
type GolfDataGame = {
  DataPlayers: GolfDataPlayer[]
  Data: string
  Time: string
  Format: string
  Holes: number
  NameCourse: string
  NumberOfPlayers: number
  Round1: string
  Round2: string
  Round3: string
  Round4: string
  StartingHole: number
};

interface IGolfDataPlayerTournament {
  Id: string
  Gender: string
  Hole: string
  Scores: number[]
  Bag: string
  Caddie: string
  CarNo: string
  Color: string
  TextColor: string
  HDC: string
  VGA: string
  NamePlayer: string
  TeeBox: string
  RoundIn: string
  RoundOut: string
}

interface IGolfDataSetupTournament {
  Address: string
  BackgroundColorForMen: string
  BackgroundColorForWomen: string
  ChoiceResult: string
  CountBack: string
  Cut: number[]
  Date: string
  Format: string
  GolfName: string
  HdcMax: number[]
  HdcMin: number[]
  Hole: number
  NameDivision: string[]
  NoneCut: string[]
  NoneDHC: string[]
  NumberOfDivision: string
  OrganizationName: string
  TeeForMen: string
  TeeForWomen: string
  TeeTime: string
  TournamentName: string
}
interface IGolfDataPlayersTournament {
  Bag: string
  Caddie: string
  CarNo: string
  Color: string
  Gender: string
  HDC: string
  Hole: string
  Id: string
  NamePlayer: string
  Scores: number[]
  TeeBox: string
  TextColor: string
  VGA: string
}

interface IGolf_Data_Player {
  NamePlayer: string
  HDC: string
  VGA: string
  TeeBox: string
  Color: string
  TextColor: string
  Bag: string
  Caddie: string
  CarNo: string
  Scores: number[]
}

interface IListGolfSetup {
  [key: string]:
  {
    Information:
    {
      NameGolf: string,
      AddressGolf: string
      TelGolf: string
      ContactGolf: string
      NumberOfHolesGolf: number
    }
  }
}
interface IGolfSetupAll {
  Information:
  {
    NameGolf: string,
    AddressGolf: string
    TelGolf: string
    ContactGolf: string
    NumberOfHolesGolf: number
  },
  Course: IGolfSetupCourse[],
  GamePersonal: IGolfTournamentSetupArr[]
}

interface IListGolfSetupCourse {
  [key: string]:
  {
    HDC: number[],
    NameCourse: string
    NumberTeeBox: number
    PAR: number[]
    Tee1: IStickInput,
    Tee2: IStickInput,
    Tee3: IStickInput,
    Tee4: IStickInput,
    Tee5: IStickInput,
    Tee6: IStickInput
  }
}

interface IGolfSetup {
  NameGolf: string,
  AddressGolf: string
  TelGolf: string
  ContactGolf: string
  NumberOfHolesGolf: number
}

interface IGolfTournamentSetup {
  TournamentName: string,
  Date: string
  TeeTime: string
  Address: string
  OrganizationName: string
  GolfName: string
  Hole: number
  Round1: string
  Round2: string
  Round3: string
  Round4: string
  Round4: string
  TeeForMen: string
  TeeForWomen: string
  Format: string
  NumberOfDivision: string
  HdcMin: number[]
  HdcMax: number[]
  ChoiceResult: string
}
interface IGolfTournamentSetupArr {
  [key: string]: {
    Setup: {
      TournamentName: string,
      Date: string
      TeeTime: string
      Address: string
      OrganizationName: string
      GolfName: string
      Hole: number
      Round1: string
      Round2: string
      Round3: string
      Round4: string
      Round4: string
      TeeForMen: string
      TeeForWomen: string
      Format: string
      NumberOfDivision: string
      HdcMin: number[]
      HdcMax: number[]
      ChoiceResult: string
    }
  }
}

interface IStickInput {
  TeeBoxName: string
  Sloping: number
  Rating: number
  Color: string
  TextColor: string
  Value: number[]
}

interface IGolfSetupCourse {
  HDC: number[],
  NameCourse: string
  NumberTeeBox: number
  PAR: number[]
  Tee1: IStickInput,
  Tee2: IStickInput,
  Tee3: IStickInput,
  Tee4: IStickInput,
  Tee5: IStickInput,
  Tee6: IStickInput
}

interface IGolfSetupTeeBox {
  TeeBoxName: string
  Color: string,
  TextColor: string
}

interface IGhiDiem {
  [key: string]: {
    NameGroup: string
    Time: string
  }
}

interface IListGolfSetupInformation {
  [key: string]: {
    NameGolf: string,
    AddressGolf: string
    TelGolf: string
    ContactGolf: string
    NumberOfHolesGolf: number
  }
}

interface IGolfSetupInformation {
  NameGolf: string,
  AddressGolf: string
  TelGolf: string
  ContactGolf: string
  NumberOfHolesGolf: number
}

interface IContactInfo {
  emailInformation: string,
  nameInformation: string,
  telInformation: string,
  serviceCaddie: string,
  serviceClubRental: string
}
interface INamePlayer {
  name: string,
  indexOrder: number
}
interface IListBookingData {
  numberPlayer: number,
  selectTime: string,
  namePlayer1: INamePlayer,
  namePlayer2: INamePlayer,
  namePlayer3: INamePlayer,
  namePlayer4: INamePlayer,
  ContactInfo: IContactInfo[]
}