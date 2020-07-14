export default abstract class IRecordService {
  abstract startRecording(roomId: string, recordId: string): Promise<boolean>;

  abstract stopRecording(roomId: string): Promise<boolean>;
}
