const inquirer = require('inquirer');

const channelName = 'SMS';

async function configure(context) {
  const isChannelEnabled =
    context.exeInfo.serviceMeta.output[channelName] &&
    context.exeInfo.serviceMeta.output[channelName].Enabled;

  if (isChannelEnabled) {
    context.print.info(`The ${channelName} channel is currently enabled`);
    const answer = await inquirer.prompt({
      name: 'disableChannel',
      type: 'confirm',
      message: `Do you want to disable the ${channelName} channel`,
      default: false,
    });
    if (answer.disableChannel) {
      await disable(context);
    }
  } else {
    const answer = await inquirer.prompt({
      name: 'enableChannel',
      type: 'confirm',
      message: `Do you want to enable the ${channelName} channel`,
      default: true,
    });
    if (answer.enableChannel) {
      await enable(context);
    }
  }
}

function enable(context) {
  const params = {
    ApplicationId: context.exeInfo.serviceMeta.output.Id,
    SMSChannelRequest: {
      Enabled: true,
    },
  };
  return new Promise((resolve, reject) => {
    context.exeInfo.pinpointClient.updateSmsChannel(params, (err, data) => {
      if (err) {
        context.print.error('update channel error');
        reject(err);
      } else {
        context.print.info(`The ${channelName} channel has been successfully enabled.`);
        context.exeInfo.serviceMeta.output[channelName] = data.SMSChannelResponse;
        resolve(data);
      }
    });
  });
}

function disable(context) {
  const params = {
    ApplicationId: context.exeInfo.serviceMeta.output.Id,
    SMSChannelRequest: {
      Enabled: false,
    },
  };
  return new Promise((resolve, reject) => {
    context.exeInfo.pinpointClient.updateSmsChannel(params, (err, data) => {
      if (err) {
        context.print.error('update channel error');
        reject(err);
      } else {
        context.print.info(`The ${channelName} channel has been disabled.`);
        context.exeInfo.serviceMeta.output[channelName] = data.SMSChannelResponse;
        resolve(data);
      }
    });
  });
}

module.exports = {
  configure,
  enable,
  disable
};
