import chai from 'chai';
import chaiThings from 'chai-things';
import chaiLike from 'chai-like';
//For whatever reason the order of these 2 plugins matter
chai.use(chaiLike);
chai.use(chaiThings);

chai.config.includeStack = true;
