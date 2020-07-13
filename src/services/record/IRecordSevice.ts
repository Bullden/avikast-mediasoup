export default abstract class IRecordService {
  abstract startRecording(roomId: string): Promise<boolean>;

  abstract stopRecording(roomId: string): Promise<boolean>;
}
