import com.alibaba.fastjson.JSON;
import com.ww.websocket.model.ResultMessage;
import com.ww.websocket.model.User;
import org.junit.Test;

public class Test1 {
    @Test
    public void test1(){
        User user = new User("zs");
        ResultMessage aa = new ResultMessage(0, "你好", user);
        String s = JSON.toJSONString(aa);
        System.out.println(s);
    }
}
