export interface SkillType {
  name: string;
  mandatory: boolean;
  properties: SkillProperties;
}

export interface SkillProperties {
  video_resource: string;
  level: string;
  Nodeid: string;
  name: string;
  type: string;
  reading_resource: string;
}

export interface FullStackType {
  job: string;
  skills: SkillType[];
}