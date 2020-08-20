import { Details } from './details';

export interface Card{
  title: string,
  description: string,
  selected: boolean,
  params: Details[]
}