import Room from 'entities/Room';

export default abstract class IRoomManager {
  abstract createRoom(): Promise<Room>;
}
