import React, { useState } from "react";
import { useTransition, animated } from "react-spring";
import { FiX } from "react-icons/fi";
import { DEBUG } from "config";
import { IMessage, ICentralStore } from "types";
import { connect } from "util/homemadeRedux/connect";
import { removeMessageAction } from "util/homemadeRedux/actions";
import { Subtract } from "utility-types";

interface IMessageHubProps {
  messages: IMessage[];
  removeMessage: (messageId: IMessage["id"]) => void;
}

const MessageHub = ({ messages, removeMessage }: IMessageHubProps) => {
  const config = { tension: 125, friction: 20, precision: 0.1 };
  const timeout = 3000;
  const [refMap] = useState<Map<IMessage, HTMLDivElement>>(() => new Map());
  const [cancelMap] = useState<Map<IMessage, Function>>(() => new Map());

  const transition = useTransition(messages, {
    key: (msg) => msg.id,
    from: { opacity: 0, height: 0, life: "100%", dead: 1 },
    enter: (msg) => async (next, stop) => {
      DEBUG && console.log(`  Entering:`, msg.id);
      cancelMap.set(msg, () => {
        DEBUG && console.log(`  Cancelled:`, msg.id);
        stop();
        removeMessage(msg.id);
      });
      await next({
        opacity: 1,
        height: refMap.get(msg) ? refMap.get(msg)!.offsetHeight : 48,
        config,
      });
      await next({ life: "0%", config: { duration: timeout } });
      msg.autoDisappear && cancelMap.get(msg)!();
    },
    leave: (msg) => async (next) => {
      DEBUG && console.log(`  Leaving:`, msg.id);
      await next({ opacity: 0, height: 0, config });
      await next({ dead: 0, config });
    },
  });

  return (
    <div id="message-hub-positioner">
      <div className="message-container">
        {transition(({ life, dead, ...style }, msg) => {
          return dead.get() === 0 ? null : (
            <animated.div className="message" key={msg.id} style={style}>
              <div
                className="message-content"
                ref={(ref) => ref && refMap.set(msg, ref)}
              >
                {msg.autoDisappear && (
                  <animated.div
                    className="messageLife"
                    style={{ right: life }}
                  />
                )}
                <p>{msg.text}</p>
                <button
                  className="clear-message-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelMap.has(msg) && cancelMap.get(msg)!();
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
            </animated.div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state: ICentralStore) => ({
  messages: state.messages,
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
  removeMessage: (messageId: IMessage["id"]) =>
    dispatch(removeMessageAction(messageId)),
});

// if there're props other than mapped props,
// calculate the IOwnProps then pass to connect.
interface mappedProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}
type IOwnProps = Subtract<IMessageHubProps, mappedProps>;

export default connect<IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(MessageHub);
