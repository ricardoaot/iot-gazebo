import { Controller, Get, Query } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { SensorData } from './sensor-data.entity';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly mqttService: MqttService) {}

  @Get()
  async getAllMessages(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit = '20',
  ): Promise<SensorData[]> {
    return this.mqttService.getMessages({
      from,
      to,
      limit: parseInt(limit, 10),
    });
  }
}