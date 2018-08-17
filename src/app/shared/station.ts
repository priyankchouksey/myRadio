import { Option } from '../core/interfaces';

export class Station {
  id?: string;
  active: boolean;
  createdate: Date;
  createdby: string;
  frequency: string;
  logo: string;
  name: string;
  playurl: string;
  website: string;
  assistKeyword: string;
  favourite: boolean;
  playing: boolean;
  geo = new GeoLocation();
  userstatioid: string;
  addedtoshare: boolean;
  callnumber: string;
  genre: string;
  generText: string;
  language: string;
  languageText: string;
  constructor (rawData?: any) {
    if (rawData) {
      this.id = rawData.id;
      this.userstatioid = rawData.usID;
      this.active = true;
      this.geo.city = rawData.city;
      this.geo.country = rawData.country;
      this.geo.state = rawData.state;
      this.createdby = rawData.createdby;
      this.frequency = rawData.frequency;
      this.logo = rawData.logo;
      this.name = rawData.name;
      this.playurl = rawData.playurl;
      this.playing = rawData.isplaying;
      this.favourite = rawData.favourite;
      this.assistKeyword = rawData.assistantkeyword;
      this.website = rawData.website;
      this.callnumber = rawData.callnumber;
      this.language = rawData.language;
      this.genre = rawData.genre;
    }
  }
  getLanguage() {
    if (!this.language) {return ''; }
    return Languages.find(item => item.value === this.language).title;
  }
  getGenre() {
    if (!this.genre) {return ''; }
    return Genres.find(item => item.value === this.genre).title;
  }
}
export class UserStation {
  id?: string;
  userID: string;
  stationID: string;
  playing: boolean;
  favourite: boolean;
}
export class GeoLocation {
  city: string;
  country: string;
  state: string;
}
export class PlayingInfo {
  title: string;
  nowPlaying: string;
  image: string;
  constructor(title: string, nowPlaying: string, image: string) {
    this.title = title;
    this.nowPlaying = nowPlaying;
    this.image = image;
  }
}
export const Languages: Array<Option> = [
  { value: 'abo', title: 'Aboriginal'},
  { value: 'afr', title: 'Afrikaans'},
  { value: 'aka', title: 'Akan'},
  { value: 'alb', title: 'Albanian'},
  { value: 'ara', title: 'Arabic'},
  { value: 'arm', title: 'Armenian'},
  { value: 'aze', title: 'Azeri'},
  { value: 'bak', title: 'Bashkir'},
  { value: 'baq', title: 'Basque'},
  { value: 'bel', title: 'Belarusian'},
  { value: 'ben', title: 'Bengali'},
  { value: 'ber', title: 'Berber'},
  { value: 'bih', title: 'Bihari'},
  { value: 'bho', title: 'Bhojpuri'},
  { value: 'bos', title: 'Bosnian'},
  { value: 'bul', title: 'Bulgarian'},
  { value: 'can', title: 'Cantonese'},
  { value: 'cat', title: 'Catalan'},
  { value: 'nya', title: 'Chichewa'},
  { value: 'chi', title: 'Chinese'},
  { value: 'hrv', title: 'Croatian'},
  { value: 'cze', title: 'Czech'},
  { value: 'dan', title: 'Danish'},
  { value: 'dar', title: 'Dari'},
  { value: 'div', title: 'Dhivehi'},
  { value: 'dut', title: 'Dutch'},
  { value: 'eng', title: 'English'},
  { value: 'est', title: 'Estonian'},
  { value: 'fao', title: 'Faroese'},
  { value: 'fij', title: 'Fijian'},
  { value: 'fin', title: 'Finnish'},
  { value: 'frm', title: 'French'},
  { value: 'gla', title: 'Gaelic'},
  { value: 'glg', title: 'Galician'},
  { value: 'gmh', title: 'German'},
  { value: 'grc', title: 'Greek'},
  { value: 'guj', title: 'Gujarati'},
  { value: 'hat', title: 'Haitian'},
  { value: 'hau', title: 'Hausa'},
  { value: 'haw', title: 'Hawaiian'},
  { value: 'heb', title: 'Hebrew'},
  { value: 'hin', title: 'Hindi'},
  { value: 'hun', title: 'Hungarian'},
  { value: 'ice', title: 'Icelandic'},
  { value: 'ind', title: 'Indonesian'},
  { value: 'gle', title: 'Irish'},
  { value: 'ita', title: 'Italian'},
  { value: 'jpn', title: 'Japanese'},
  { value: 'kan', title: 'Kannada'},
  { value: 'kas', title: 'Kashmiri'},
  { value: 'kaz', title: 'Kazakh'},
  { value: 'kem', title: 'Khmer'},
  { value: 'kor', title: 'Korean'},
  { value: 'kur', title: 'Kurdish'},
  { value: 'kir', title: 'Kyrgyz'},
  { value: 'lao', title: 'Lao'},
  { value: 'lav', title: 'Latvian'},
  { value: 'lit', title: 'Lithuanian'},
  { value: 'mac', title: 'Macedonian'},
  { value: 'may', title: 'Malay'},
  { value: 'mal', title: 'Malayalam'},
  { value: 'mlt', title: 'Maltese'},
  { value: 'mon', title: 'Mongolian'},
  { value: 'mul', title: 'Multilingual'},
  { value: 'bur', title: 'Burmese'},
  { value: 'ned', title: 'Ndebele'},
  { value: 'nep', title: 'Nepali'},
  { value: 'nno', title: 'Norwegian'},
  { value: 'nob', title: 'Norwegian Bokmal'},
  { value: 'ori', title: 'Oriya'},
  { value: 'pap', title: 'Papiamentu'},
  { value: 'pus', title: 'Pashto'},
  { value: 'per', title: 'Persian'},
  { value: 'pol', title: 'Polish'},
  { value: 'por', title: 'Portuguese'},
  { value: 'pan', title: 'Punjabi'},
  { value: 'rum', title: 'Romanian'},
  { value: 'roh', title: 'Romansch'},
  { value: 'rus', title: 'Russian'},
  { value: 'smi', title: 'Sami'},
  { value: 'srp', title: 'Serbian'},
  { value: 'sna', title: 'Shona'},
  { value: 'snd', title: 'Sindhi'},
  { value: 'sin', title: 'Sinhala'},
  { value: 'slo', title: 'Slovak'},
  { value: 'slv', title: 'Slovenian'},
  { value: 'spa', title: 'Spanish'},
  { value: 'swa', title: 'Swahili'},
  { value: 'swe', title: 'Swedish'},
  { value: 'tgl', title: 'Tagalog'},
  { value: 'tam', title: 'Tamil'},
  { value: 'tat', title: 'Tatar'},
  { value: 'tel', title: 'Telugu'},
  { value: 'tha', title: 'Thai'},
  { value: 'tib', title: 'Tibetan'},
  { value: 'tur', title: 'Turkish'},
  { value: 'tuk', title: 'Turkmen'},
  { value: 'ukr', title: 'Ukrainian'},
  { value: 'urd', title: 'Urdu'},
  { value: 'uig', title: 'Uyghur'},
  { value: 'uzb', title: 'Uzbek'},
  { value: 'vie', title: 'Vietnamese'},
  { value: 'wel', title: 'Welsh'},
  { value: 'yor', title: 'Yoruba'}];

export const Genres: Option[] = [

  { value: '80s', title: '80\'s Rock'},
  { value: '90s', title: '90\s Rock'},
  { value: 'aaa', title: 'Adult Album Alternative'},
  { value: 'adc', title: 'Adult Contemporary'},
  { value: 'jak', title: 'Adult Hits'},
  { value: 'alt', title: 'Alternative'},
  { value: 'amc', title: 'Americana'},
  { value: 'asn', title: 'Asian'},
  { value: 'blu', title: 'Blues'},
  { value: 'bnz', title: 'Business News'},
  { value: 'reg', title: 'Carribean'},
  { value: 'kid', title: 'Children\'s'},
  { value: 'chr', title: 'Christian Contemporary'},
  { value: 'clh', title: 'Classic Hits'},
  { value: 'clr', title: 'Classic Rock'},
  { value: 'cls', title: 'Classical'},
  { value: 'col', title: 'College'},
  { value: 'com', title: 'Comedy'},
  { value: 'cnt', title: 'Country'},
  { value: 'dnc', title: 'Dance'},
  { value: 'ezy', title: 'Easy Listening'},
  { value: 'eth', title: 'Ethnic'},
  { value: 'frm', title: 'Farm'},
  { value: 'fol', title: 'Folk'},
  { value: 'gos', title: 'Gospel Music'},
  { value: 'k12', title: 'Grade School (K-12)'},
  { value: 'hip', title: 'Hip Hop'},
  { value: 'hac', title: 'Hot AC'},
  { value: 'int', title: 'International'},
  { value: 'jaz', title: 'Jazz'},
  { value: 'nws', title: 'News'},
  { value: 'nst', title: 'News/Talk'},
  { value: 'nos', title: 'Nostalgia'},
  { value: 'old', title: 'Oldies'},
  { value: 'oth', title: 'Other'},
  { value: 'pub', title: 'Public Radio'},
  { value: 'mex', title: 'Regional Mexican'},
  { value: 'rel', title: 'Religious'},
  { value: 'jol', title: 'Rhythmic Oldies'},
  { value: 'rok', title: 'Rock'},
  { value: 'smj', title: 'Smooth Jazz'},
  { value: 'spa', title: 'Spanish'},
  { value: 'spc', title: 'Spanish Christian'},
  { value: 'spn', title: 'Spanish News'},
  { value: 'spp', title: 'Spanish Pop'},
  { value: 'sps', title: 'Spanish Sports'},
  { value: 'spo', title: 'Sports'},
  { value: 'tal', title: 'Talk'},
  { value: 'tej', title: 'Tejano'},
  { value: 'top', title: 'Top-40'},
  { value: 'tra', title: 'Travelers\' Information'},
  { value: 'tro', title: 'Tropical'},
  { value: 'urb', title: 'Urban Contemporary'},
  { value: 'var', title: 'Variety'}
];
