export class ForeCast {
  main: any;
  weather: any;
  clouds: any;
  wind: any;
  dt_txt: string;
}

export class City {
    country: string;
    id: number;
    name: string;
    population: number;
    timezone: number
}

export class Main {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

export class Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export class Wind {
    speed: number;
    deg: number;
}