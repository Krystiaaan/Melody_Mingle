import z, {string} from 'zod';


export const RegisterUserSchema = z.object({
  eMail: z.string().email({
    message: "Invalid email format"
  }),
  dateOfBirth: z.string({
    invalid_type_error: "Date of birth must be a string in the format YYYY-MM-DD"
  }),
  username: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type RegisterUserDTO = {
  eMail: string;
  dateOfBirth: string;
  username: string;
  passwordHash: string;
};

export const LoginSchema = z.object({
  eMail: z.string().email({
    message: "Invalid email format",
  }),
  password: z.string(),
});

export const SongSchema = z.object({
  title: z.string(),
  genre: z.string(),
  artist: z.string().optional(),
});

export type SongDTO = {
  title: string;
  genre: string;
  artist?: string;
};

export const GroupSchema = z.object({
  creator: z.string(),
  name: z.string(),
});

export type GroupDTO = {
  creator: string;
  name: string;
};

export const MatchSchema = z.object({
  userA: z.string(),
  userB: z.string(),
});

export type MatchDTO = {
  userA: string;
  userB: string;
};

export const EventSchema = z.object({
    creator: z.string(),
    eventType: z.enum(['Concert', 'Party', 'Festival']),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().optional(),
    description: z.string().optional(),
});

export type EventDTO = {
    creator: string;
    eventType: 'Concert' | 'Party' | 'Festival';
    startDate: Date;
    endDate: Date;
    location?: string;
    description?: string;
};