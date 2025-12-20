<?php

declare(strict_types=1);

namespace App\Telegram\Commands;

use App\Handlers\ServiceHandler;
use App\Services\Telegram\GenerateNewOTPCodeService;
use SergiX44\Nutgram\Handlers\Type\Command;
use SergiX44\Nutgram\Nutgram;
use SergiX44\Nutgram\Telegram\Types\Keyboard\ReplyKeyboardRemove;

final class CodeCommand extends Command
{
    protected string $command = 'code';

    protected ?string $description = 'Regenerate your verification code';

    public function __construct(
        protected ServiceHandler $handler
    ) {
        parent::__construct();
    }

    public function handle(Nutgram $bot): void
    {
        $user = $bot->user();

        if (! $user) {
            return;
        }

        $result = $this->handler->handle(new GenerateNewOTPCodeService($user->id));
        if (! $result) {
            $bot->sendMessage(
                text: "You haven't linked your account yet.

Please share your phone number first using the /start command.",
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
