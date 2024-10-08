import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ObjectRecordCreateEvent } from 'src/engine/integrations/event-emitter/types/object-record-create.event';
import { ObjectRecordDeleteEvent } from 'src/engine/integrations/event-emitter/types/object-record-delete.event';
import { ObjectRecordUpdateEvent } from 'src/engine/integrations/event-emitter/types/object-record-update.event';
import { InjectMessageQueue } from 'src/engine/integrations/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/integrations/message-queue/services/message-queue.service';
import { WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/workspace-event.type';
import { BlocklistWorkspaceEntity } from 'src/modules/blocklist/standard-objects/blocklist.workspace-entity';
import {
  BlocklistItemDeleteCalendarEventsJob,
  BlocklistItemDeleteCalendarEventsJobData,
} from 'src/modules/calendar/blocklist-manager/jobs/blocklist-item-delete-calendar-events.job';
import {
  BlocklistReimportCalendarEventsJob,
  BlocklistReimportCalendarEventsJobData,
} from 'src/modules/calendar/blocklist-manager/jobs/blocklist-reimport-calendar-events.job';

@Injectable()
export class CalendarBlocklistListener {
  constructor(
    @InjectMessageQueue(MessageQueue.calendarQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('blocklist.created')
  async handleCreatedEvent(
    payload: WorkspaceEventBatch<
      ObjectRecordCreateEvent<BlocklistWorkspaceEntity>
    >,
  ) {
    await this.messageQueueService.add<BlocklistItemDeleteCalendarEventsJobData>(
      BlocklistItemDeleteCalendarEventsJob.name,
      payload,
    );
  }

  @OnEvent('blocklist.deleted')
  async handleDeletedEvent(
    payload: WorkspaceEventBatch<
      ObjectRecordDeleteEvent<BlocklistWorkspaceEntity>
    >,
  ) {
    await this.messageQueueService.add<BlocklistReimportCalendarEventsJobData>(
      BlocklistReimportCalendarEventsJob.name,
      payload,
    );
  }

  @OnEvent('blocklist.updated')
  async handleUpdatedEvent(
    payload: WorkspaceEventBatch<
      ObjectRecordUpdateEvent<BlocklistWorkspaceEntity>
    >,
  ) {
    await this.messageQueueService.add<BlocklistItemDeleteCalendarEventsJobData>(
      BlocklistItemDeleteCalendarEventsJob.name,
      payload,
    );

    await this.messageQueueService.add<BlocklistReimportCalendarEventsJobData>(
      BlocklistReimportCalendarEventsJob.name,
      payload,
    );
  }
}
