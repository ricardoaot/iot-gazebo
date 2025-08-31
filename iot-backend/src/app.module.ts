import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';
import { SensorsController } from './sensors/sensors.controller';
import { SensorData } from './sensors/sensor-data.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ricardoolivari',
      password: '',
      database: 'iot_db',
      entities: [SensorData],
      synchronize: true, // crea tablas automáticamente en dev
    }),
    TypeOrmModule.forFeature([SensorData]),
  ],
  controllers: [AppController, SensorsController],
  providers: [AppService, MqttService],
})
export class AppModule { }
