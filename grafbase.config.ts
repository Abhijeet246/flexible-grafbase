import { g, config, auth } from '@grafbase/sdk';

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(), 
  projects: g.relation(() => Project).list().optional(),
}).auth((rules) => {
  rules.public().read()
})

// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(), 
  image: g.url(),
  liveSiteUrl: g.url(), 
  githubUrl: g.url(), 
  category: g.string().search(),
  createdBy: g.relation(() => User),
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

// @ts-ignore
const AnotherModel = g.model('AnotherModel', {
  // Define fields for your new model
  // Example:
  field1: g.string(),
  field2: g.number(),
  // Add any other fields or relationships as needed
}).auth((rules) => {
  // Define authorization rules for the new model
  // Example:
  rules.public().read()
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret:  g.env('NEXTAUTH_SECRET')
})

export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
})
