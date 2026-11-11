import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageSquareText, RotateCcw, Send, X } from 'lucide-react';
import { useAskAssistant } from '@workspace/api-client-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { LogoMark } from '@/components/brand';
import { useI18n } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; content: string };

export function Assistant() {
  const { t, lang } = useI18n();
  const { aiOpen, setAiOpen } = useStore();
  const ask = useAskAssistant();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [failed, setFailed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, ask.isPending, failed]);

  const send = async (history: Msg[]) => {
    setFailed(false);
    try {
      const res = await ask.mutateAsync({ data: { language: lang === 'ar' ? 'ar' : 'en', messages: history.slice(-16) } });
      setMsgs([...history, { role: 'assistant', content: String(res.reply ?? '') }]);
    } catch {
      setFailed(true);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim().slice(0, 2000);
    if (!text || ask.isPending) return;
    const next: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setInput('');
    void send(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAiOpen(true)}
        className={cn('group fixed bottom-5 end-5 z-40 flex items-center gap-3 bg-[#1B2A41] py-3 pe-5 ps-3 text-[#F6F1E7] shadow-[6px_6px_0_0_#B8893B] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#B8893B]', aiOpen && 'pointer-events-none opacity-0')}
        aria-label={t('ai.open')}
        data-testid="button-open-assistant"
      >
        <span className="grid h-9 w-9 place-items-center border border-[#B8893B]/60"><MessageSquareText className="h-4 w-4 text-[#B8893B]" /></span>
        <span className="hidden text-sm sm:inline">{t('ai.title')}</span>
      </button>
      <Sheet open={aiOpen} onOpenChange={setAiOpen}>
        <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="flex w-full flex-col gap-0 border-none bg-[#F6F1E7] p-0 sm:max-w-md [&>button]:hidden" data-testid="drawer-assistant">
          <div className="flex items-center gap-3 bg-[#1B2A41] px-5 py-4 text-[#F6F1E7]">
            <LogoMark className="h-9 w-9" inverted />
            <div className="flex-1">
              <SheetTitle className="text-base font-medium text-[#F6F1E7]">{t('ai.title')}</SheetTitle>
              <SheetDescription className="text-[11px] font-light text-[#F6F1E7]/60">{t('slogan')}</SheetDescription>
            </div>
            {msgs.length > 0 && (
              <button type="button" onClick={() => { setMsgs([]); setFailed(false); }} className="grid h-9 w-9 place-items-center transition-colors hover:bg-[#F6F1E7]/10" aria-label={t('ai.clear')} title={t('ai.clear')} data-testid="button-assistant-clear">
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button type="button" onClick={() => setAiOpen(false)} className="grid h-9 w-9 place-items-center transition-colors hover:bg-[#F6F1E7]/10" aria-label={t('ai.close')} data-testid="button-assistant-close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
            <div className="lattice border border-[#B8893B]/30 bg-[#EFE7D6] p-4 text-sm font-light leading-7">{t('ai.welcome')}</div>
            {msgs.map((m, i) => (
              <div key={i} className={cn('flex rise', m.role === 'user' ? 'justify-start' : 'justify-end')} data-testid={`msg-${m.role}-${i}`}>
                <p
                  dir="auto"
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap px-4 py-3 text-sm leading-7',
                    m.role === 'user' ? 'bg-[#1B2A41] text-[#F6F1E7]' : 'border border-[#1B2A41]/15 bg-[#FBF8F1] text-[#1B2A41]'
                  )}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {ask.isPending && (
              <div className="flex justify-end" data-testid="status-assistant-pending">
                <div className="flex items-center gap-2 border border-[#1B2A41]/15 bg-[#FBF8F1] px-4 py-3 text-xs text-muted-foreground">
                  {t('ai.pending')}
                  <span className="flex gap-1">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-pulse bg-[#B8893B]" style={{ animationDelay: `${d * 180}ms` }} />)}</span>
                </div>
              </div>
            )}
            {failed && (
              <div className="flex items-center justify-between gap-3 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-assistant-error">
                <span>{t('ai.err')}</span>
                <button type="button" onClick={() => send(msgs)} className="shrink-0 border border-current px-3 py-1 text-xs transition-colors hover:bg-destructive hover:text-[#F6F1E7]" data-testid="button-assistant-retry">{t('ai.retry')}</button>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="flex items-end gap-2 border-t border-[#1B2A41]/10 p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e); } }}
              rows={1}
              maxLength={2000}
              placeholder={t('ai.ph')}
              aria-label={t('ai.ph')}
              dir="auto"
              className="max-h-32 min-h-[48px] flex-1 resize-none border border-[#1B2A41]/25 bg-[#FBF8F1] px-3 py-3 text-sm outline-none transition-colors focus:border-[#B8893B]"
              data-testid="input-assistant"
            />
            <button type="submit" disabled={!input.trim() || ask.isPending} className="grid h-12 w-12 place-items-center bg-[#1B2A41] text-[#F6F1E7] transition-colors hover:bg-[#B8893B] hover:text-[#1B2A41] disabled:opacity-40" aria-label={t('ai.send')} data-testid="button-assistant-send">
              <Send className="h-4 w-4 rtl:-scale-x-100" />
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
