import Consumer from 'mediasoup/Consumer';

export default abstract class IRecordService {
  abstract startRecording(
    roomId: string,
    userId: string,
    producerId: string,
    consumer: Consumer,
  ): Promise<boolean>;

  abstract stopRecording(roomId: string): Promise<boolean>;
}
