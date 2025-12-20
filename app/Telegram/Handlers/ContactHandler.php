<?php

declare(strict_types=1);

namespace App\Telegram\Handlers;

use App\Handlers\ServiceHandler;
use App\Helpers\Normalizer\TelegramContactNormalizer;
use App\Services\Telegram\VerifyUserPhoneNumberService;
use SergiX44\Nutgram\Nutgram;
use SergiX44\Nutgram\Telegram\Types\Keyboard\ReplyKeyboardRemove;

final class ContactHandler
{
    public function __construct(
        protected ServiceHandler $handler
    ) {
    }

    public function __invoke(Nutgram $bot): void
    {
        $contact = $bot->message()?->contact;

        if ($contact === null) {
            return;
        }

        $chatId = $bot->userId();
        $phoneNumber = TelegramContactNormalizer::normalize($contact->phone_number);

        $result = $this->handler->handle(new VerifyUserPhoneNumberService($chatId, $phoneNumber));
        if (! $result) {
            $bot->sendMessage(
                text: "Sorry, this phone number is not registered in our system.

Please make sure you're using the same phone number you registered with on the Mareef (mareef.uz)",
                reply_markup: ReplyKeyboardRemove::make(remove_keyboard: true)
            );

            return;
        }

        $code = $result['data']['code'];

        $bot->sendMessage(
            text: "Your verification code is: <b>{$code}</b>",
            parse_mode: 'HTML',
            reply_markup: ReplyKeyboardRemove::make(remove_keyboard: true, selective: true)
        );
    }
}
