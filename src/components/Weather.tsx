import axios from "axios";
import { useEffect, useState } from "react";
import { ICurrent, IDaily, IHourly } from "../types/weather";
import { getCelsius } from "../utils/weather";
import Current from "./Current";
import Daily from "./Daily";
import Hourly from "./Hourly";
import Loader from "./Loader";
import SearchLocation from "./SearchLocation";
import Trigger from "./Trigger";

interface IFetchData {
  current: ICurrent;
  daily: IDaily[];
  timezone: string;
  hourly: IHourly[];
  timezone_offset: number;
}

export type WeatherType = "daily" | "hourly";

const API_KEY = "b73a6a5b395ec3602e1817fefbfc222e";
function Weather() {
  const [current, setCurrent] = useState<ICurrent | null>(null);
  const [daily, setDaily] = useState<IDaily[] | null>(null);
  const [hourly, setHourly] = useState<IHourly[] | null>(null);
  const [timezone, setTimezone] = useState("Киев");
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfWeather, setTypeOfWeather] = useState<WeatherType>("daily");
  const [lat, setLat] = useState(50.480894);
  const [lon, setLon] = useState(30.608287);
  const [timeOffset, setTimeOffset] = useState(0);
  useEffect(() => {
    setIsLoading(true);
    const currentDate = new Date();
    axios
      .get<IFetchData>("https://api.openweathermap.org/data/3.0/onecall", {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY,
          lang: "ru",
        },
      })
      .then((res) => {
        console.log(res.data);
        return res;
      })
      .then((res) => {
        setCurrent(res.data.current);
        setDaily(res.data.daily);
        setHourly(res.data.hourly.slice(0, 23));
        setTimeOffset(res.data.timezone_offset);
      })
      .catch((err) => alert(err))
      .finally(() => {
        if (+new Date() - +currentDate < 1000) {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } else {
          setIsLoading(false);
        }
      });
  }, [lat, lon]);
  if (!current) {
    return <div>Ошибка при получении данных</div>;
  }

  if (!current) {
    return <div>Ошибка при получении данных</div>;
  }

  console.log(window.innerWidth);

  function setType(type: WeatherType) {
    setTypeOfWeather(type);
  }
  function setCoordinates(lat: number, lng: number) {
    setLat(lat);
    setLon(lng);
  }
  function setLocationName(location: string) {
    if (window.innerWidth > 992) {
      if (location.length > 25) {
        setTimezone(location.slice(0, 23) + "...");
      } else {
        setTimezone(location);
      }
    } else {
      setTimezone(location);
    }
  }
  return (
    <>
      {isLoading && <Loader />}
      <div className="timezone">
        {timezone}
        <div>{getCelsius(current.temp)} °C</div>
      </div>
      <SearchLocation setCoordinates={setCoordinates} setLocationName={setLocationName} />
      <div className="current__now">Погода сейчас</div>
      <Current {...current} />
      <Trigger setTypeOfWeather={setType} typeOfWeather={typeOfWeather} />
      {typeOfWeather === "daily" ? (
        <div className="daily">
          {daily?.map((day) => (
            <Daily key={day.dt} {...day} timeOffset={timeOffset} />
          ))}
        </div>
      ) : (
        <div className="hourly">
          {hourly?.map((hour) => (
            <Hourly key={hour.dt} {...hour} timeOffset={timeOffset} />
          ))}
        </div>
      )}
    </>
  );
}

export default Weather;
