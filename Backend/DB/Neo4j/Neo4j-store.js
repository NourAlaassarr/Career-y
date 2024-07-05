import session from 'express-session';
import neo4j from 'neo4j-driver';

class Neo4jStore extends session.Store {
  constructor(options) {
    super();
    this.driver = neo4j.driver(options.uri, neo4j.auth.basic(options.user, options.password));
  }

  async get(sid, callback) {
    const neoSession = this.driver.session();
    try {
      const result = await neoSession.run(
        'MATCH (s:Session {sid: $sid}) RETURN s',
        { sid }
      );
      neoSession.close();
      if (result.records.length) {
        const sessionData = result.records[0].get('s').properties;
        callback(null, JSON.parse(sessionData.data));
      } else {
        callback(null, null);
      }
    } catch (err) {
      neoSession.close();
      callback(err);
    }
  }

  async set(sid, session, callback) {
    const neoSession = this.driver.session();
    try {
      await neoSession.run(
        'MERGE (s:Session {sid: $sid}) SET s.data = $data',
        { sid, data: JSON.stringify(session) }
      );
      neoSession.close();
      callback(null);
    } catch (err) {
      neoSession.close();
      callback(err);
    }
  }

  async destroy(sid, callback) {
    const neoSession = this.driver.session();
    try {
      await neoSession.run(
        'MATCH (s:Session {sid: $sid}) DELETE s',
        { sid }
      );
      neoSession.close();
      callback(null);
    } catch (err) {
      neoSession.close();
      callback(err);
    }
  }
}

export default Neo4jStore;
