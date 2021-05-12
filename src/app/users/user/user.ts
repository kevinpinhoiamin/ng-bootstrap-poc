import { UserProfilePicture } from './user-profile-picture';
import { Company } from 'src/app/companies/company/company';
import { UserGender } from './user-gender';
import { UserProfile } from './user-profile';

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  profile: UserProfile;
  company: Company;
  active: boolean;
  gender: UserGender;
  profilePicture: UserProfilePicture;
}
